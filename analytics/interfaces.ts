export interface File {
    fileId: string,
    content: string
  }

export interface Analytics {
	numFiles: number;
	readability: {
		[key: string | number]: number;
	},
  badfiles: File[];
}
