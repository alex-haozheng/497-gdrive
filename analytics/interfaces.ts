export interface File {
	fileId: string;
	content: string;
}

interface ReadabilityMap {
  [key: string | number]: number
}

export interface Analytics {
	numFiles: number;
	readability: ReadabilityMap;
	badfiles: File[];
}
