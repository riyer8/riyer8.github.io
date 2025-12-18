import essayData from './essayData';
import bookData from './bookData';
import archiveData from './archivesData';
import careerData from './careerData';

const bookshelfData = [...essayData, ...bookData, ...archiveData, ...careerData];

export default bookshelfData;
