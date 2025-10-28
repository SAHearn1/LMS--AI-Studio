export const fileToBase64 = (file: File | string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const handleReaderLoad = (reader: FileReader) => {
      const result = reader.result as string;
      if (!result) {
        resolve('');
        return;
      }
      const parts = result.split(',');
      if (parts.length === 2 && parts[1]) {
        resolve(parts[1]);
      } else {
        resolve('');
      }
    };

    if (typeof file === 'string') {
        // It's a URL, fetch and convert
        fetch(file)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.blob()
            })
            .then(blob => {
                const reader = new FileReader();
                reader.onload = () => handleReaderLoad(reader);
                reader.onerror = error => reject(error);
                reader.readAsDataURL(blob);
            })
            .catch(reject);
    } else {
        // It's a File object
        const reader = new FileReader();
        reader.onload = () => handleReaderLoad(reader);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    }
  });
};

export const triggerFileUpload = (accept: string, onUpload: (file: File) => void) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.onchange = (e) => {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            onUpload(target.files[0]);
        }
    };
    input.click();
};

export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}