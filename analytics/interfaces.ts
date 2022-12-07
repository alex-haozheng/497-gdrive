export interface File {
    fileId: string,
    content: string
  }

export interface Analytics {
	numFiles: number;
	readabilityDistribution: {
		[key: string | number]: number;
	},
  badfiles: File[];
}
