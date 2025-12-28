import essayData from './essayData';
import bookData from './bookData';
import archiveData from './archivesData';
import researchPaperData from './researchPaperData';
import careerData from './careerData';

const bookshelfData = [...essayData, ...bookData, ...archiveData, ...careerData, ...researchPaperData];

export default bookshelfData;
