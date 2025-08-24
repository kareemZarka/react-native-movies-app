export const POSES: Pose[] = ["left", "right", "straight"];

export const LABEL: Record<Pose, string> = {
    left: "Look left",
    right: "Look right",
    straight: "Look straight",
};

async function appendBlob(form: FormData, name: string, uri: string) {
    const blob = await (await fetch(uri)).blob();
    form.append(name, blob, `${name}.jpg`);
}

export async function uploadFaces(photos: Photos) {
    const form = new FormData();
    for (const pose of POSES) {
        const uri = photos[pose];
        if (!uri) throw new Error(`Missing photo for ${pose}`);
        await appendBlob(form, pose, uri);
    }
    const res = await fetch("https://example.com/api/upload-faces", {
        method: "POST",
        body: form,
    });
    if (!res.ok) throw new Error(`Upload failed (${res.status})`);
}
