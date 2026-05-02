import { createPdfiumDirectEngine } from '@embedpdf/engines/pdfium';
import type { PdfEngine } from '@embedpdf/engines';
import wasmUrl from '@embedpdf/pdfium/pdfium.wasm?url';

let enginePromise: Promise<PdfEngine<Blob>> | null = null;

export type PdfUploadMetadata = {
	pageCount: number;
};

export type PdfUploadPreparation = PdfUploadMetadata & {
	coverBlob: Blob;
};

function getEngine(): Promise<PdfEngine<Blob>> {
	enginePromise ??= createPdfiumDirectEngine(wasmUrl);
	return enginePromise;
}

export async function preparePdfUpload(file: File): Promise<PdfUploadPreparation> {
	const engine = await getEngine();
	const content = await file.arrayBuffer();
	const doc = await engine
		.openDocumentBuffer({
			id: crypto.randomUUID(),
			content
		})
		.toPromise();

	try {
		const page = doc.pages[0];
		if (!page) throw new Error('The PDF does not contain any pages.');

		const scaleFactor = Math.min(2, Math.max(1, 1200 / page.size.width));
		const coverBlob = await engine
			.renderPage(doc, page, {
				imageType: 'image/jpeg',
				imageQuality: 0.88,
				scaleFactor,
				dpr: 1,
				withAnnotations: true,
				withForms: true
			})
			.toPromise();

		return {
			coverBlob,
			pageCount: doc.pageCount
		};
	} finally {
		await engine
			.closeDocument(doc)
			.toPromise()
			.catch(() => false);
	}
}
