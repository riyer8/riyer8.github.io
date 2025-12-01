import essayData from './essayData';
import bookData from './bookData';
import archiveData from './archivesData';

const bookshelfData = [...essayData, ...bookData, ...archiveData];

export default bookshelfData;
