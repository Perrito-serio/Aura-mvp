// src/app/api/tryon/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import fs from 'fs/promises'; // Para leer archivos del servidor
import path from 'path'; // Para construir rutas de archivo
import mime from 'mime-types'; // Para obtener el mime-type

// --- Configuración de Gemini ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error("La variable de entorno GEMINI_API_KEY no está definida.");
}
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
// Asegúrate de usar un modelo compatible con imágenes como input, como gemini-1.5-flash
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" }); // <-- Añadir "-latest"
// ----------------------------

// --- Función Helper para convertir archivo local a Part de Gemini ---
async function fileToGenerativePart(relativePath: string): Promise<Part> {
  // Construye la ruta absoluta al archivo dentro de la carpeta 'public'
  const filePath = path.join(process.cwd(), 'public', relativePath);
  try {
    // Lee el archivo como un buffer
    const buffer = await fs.readFile(filePath);
    // Convierte el buffer a base64
    const base64Data = buffer.toString("base64");
    // Determina el tipo MIME usando la extensión del archivo
    const mimeType = mime.lookup(filePath) || 'application/octet-stream'; // Proporciona un fallback
    if (!mimeType.startsWith('image/')) {
        console.warn(`Tipo MIME no reconocido como imagen para ${filePath}: ${mimeType}. Usando fallback.`);
        // Podrías decidir lanzar un error aquí si solo quieres imágenes
    }
    console.log(`Leyendo archivo: ${filePath}, MimeType: ${mimeType}`); // Log para depuración
    // Devuelve el objeto Part en el formato que Gemini espera
    return {
      inlineData: {
        data: base64Data,
        mimeType,
      },
    };
  } catch (error) {
     console.error(`Error al leer el archivo: ${filePath}`, error);
     // Lanza un error más descriptivo si el archivo no se puede leer
     throw new Error(`No se pudo leer o procesar el archivo: ${relativePath}`);
  }
}
// -----------------------------------------------------------

export async function POST(request: Request) {
  try {
    // Obtiene las URLs de las imágenes del cuerpo de la solicitud JSON
    const body = await request.json();
    const { userImageUrl, garmentImageUrl } = body; // ej: "/uploads/user123.jpg", "/garments/shirts/shirt-1.png"

    console.log("Recibido para TryOn:", { userImageUrl, garmentImageUrl });

    // Validación simple de entrada
    if (!userImageUrl || !garmentImageUrl) {
      return NextResponse.json({ success: false, message: 'Faltan URLs de imagen de usuario o prenda.' }, { status: 400 });
    }

    // --- Convertir imágenes locales a Parts para Gemini ---
    // Llama a la función helper para procesar ambas imágenes
    const userImagePart = await fileToGenerativePart(userImageUrl);
    const garmentImagePart = await fileToGenerativePart(garmentImageUrl);
    // -----------------------------------------------------

    // --- Prompt COMPLETO para Gemini ---
    const prompt = `You are an expert virtual try-on AI. You will be given a 'model image' and a 'garment image'. Your task is to create a new photorealistic image where the person from the 'model image' is wearing the clothing from the 'garment image'.
        **Crucial Rules:**
        1.  **Complete Garment Replacement:** You MUST completely REMOVE and REPLACE the clothing item worn by the person in the 'model image' with the new garment. No part of the original clothing (e.g., collars, sleeves, patterns) should be visible in the final image.
        2.  **Preserve the Model:** The person's face, hair, body shape, and pose from the 'model image' MUST remain unchanged.
        3.  **Preserve the Background:** The entire background from the 'model image' MUST be preserved perfectly.
        4.  **Apply the Garment:** Realistically fit the new garment onto the person, adapting to their pose with natural folds, shadows, and lighting consistent with the original scene.
        5.  **Output:** Return ONLY the final, edited image. Do not include any text.`;
    // ------------------------------------

    console.log("Enviando petición a Gemini...");

    // --- Llamada a la API de Gemini ---
    // Envía el prompt y las dos imágenes (como Parts) al modelo
    const result = await model.generateContent([
      prompt, // Las instrucciones
      userImagePart, // La imagen del usuario
      garmentImagePart // La imagen de la prenda
    ]);

    // Extrae la respuesta principal
    const response = result.response;
    console.log("Respuesta recibida de Gemini.");

    // --- Procesar la respuesta ---
    // Intenta obtener el primer candidato de respuesta
    const candidate = response.candidates?.[0];
    // Dentro del contenido del candidato, busca la primera parte que contenga datos de imagen ('inlineData')
    const imagePart = candidate?.content?.parts?.find(part => part.inlineData);

    // Si se encontró una parte con imagen...
    if (imagePart?.inlineData) {
      const { mimeType, data } = imagePart.inlineData; // Extrae el tipo MIME y los datos base64
      // Construye la Data URL completa
      const dataUrl = `data:${mimeType};base64,${data}`;
      console.log("TryOn exitoso. Devolviendo Data URL.");
      // Devuelve éxito y la Data URL al frontend
      return NextResponse.json({ success: true, resultImageUrl: dataUrl });
    } else {
      // Si no se encontró imagen, intenta diagnosticar el problema
      const blockReason = response.promptFeedback?.blockReason; // Razón de bloqueo (seguridad)
      const finishReason = candidate?.finishReason; // Razón de finalización (aparte de éxito)
      const textResponse = response.text(); // ¿Respondió con texto?
      console.error("Gemini no devolvió una imagen.", { blockReason, finishReason, textResponse });
      // Construye un mensaje de error útil
      let message = "La IA no pudo generar la imagen.";
      if (blockReason) message += ` Motivo bloqueo: ${blockReason}.`;
      if (finishReason && finishReason !== 'STOP') message += ` Motivo finalización: ${finishReason}.`;
      if (textResponse) message += ` Respuesta de texto: ${textResponse}`;
      // Devuelve un error 500 con el mensaje al frontend
      return NextResponse.json({ success: false, message }, { status: 500 });
    }
    // -----------------------------

  } catch (error: any) { // Captura cualquier otro error (lectura de archivo, red, etc.)
    console.error('Error en la API /api/tryon:', error);
    // Devuelve un error 500 genérico o el mensaje de error específico
    return NextResponse.json({ success: false, message: error.message || 'Error interno del servidor.' }, { status: 500 });
  }
}