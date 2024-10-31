const docIsViewed = doc => {
	return 'unread' !== doc.status;
};

const docIsImage = doc => {
	const imageTypes = ['jpg', 'png', 'gif'];

	return imageTypes.includes(doc.type);
};

const docIcon = doc => {
	let icon = '';

	switch (doc.type) {
		case 'pdf':
			icon = 'pdf';
			break;

		case 'doc':
		case 'docx':
			icon = 'word';
			break;

		case 'xls':
		case 'xlsx':
			icon = 'excel';
			break;

		case 'jpg':
		case 'gif':
		case 'png':
		case 'tiff':
		case 'ai':
		case 'psd':
		case 'eps':
		case 'svg':
			icon = 'image';
			break;

		case 'txt':
			icon = 'alt';
			break;

		case 'zip':
			icon = 'archive';
			break;
	}

	return 'file' + (icon.length > 0 ? '-' + icon : '');
};

const docDate = timestamp => {
	const date = new Date(timestamp * 1000);
	return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${(
		'0' + date.getDate()
	).slice(-2)}`;
};

export default { docIsViewed, docIcon, docDate, docIsImage };
