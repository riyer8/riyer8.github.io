import React from 'react';
import { useTheme } from '../../context/ThemeContext';

import bookCover1 from '../../assets/bookshelf/books/book1.png';
import bookCover2 from '../../assets/bookshelf/books/book2.png';
import bookCover3 from '../../assets/bookshelf/books/book3.png';

import researchPaper1 from '../../assets/bookshelf/researchPapers/To Be Added.png';
import researchPaper2 from '../../assets/bookshelf/researchPapers/To Be Added.png';
import researchPaper3 from '../../assets/bookshelf/researchPapers/To Be Added.png';

import essay1 from '../../assets/bookshelf/essays/To Be Added.png';
import essay2 from '../../assets/bookshelf/essays/To Be Added.png';
import essay3 from '../../assets/bookshelf/essays/To Be Added.png';

const BookshelfSection = ({ screenSize }) => {
    const { theme } = useTheme();
    const { width, shouldCollapseSidebar } = screenSize;

    // Determine how many items to show based on available space
    const getItemsToShow = () => {
        if (width < 380) return 1;
        if (width < 600) return 2;
        return 3;
    };

    const itemsToShow = getItemsToShow();

    // Responsive sizing calculations
    const getResponsiveSize = (mobileSize, tabletSize, desktopSize) => {
        if (shouldCollapseSidebar) return mobileSize;
        if (screenSize.isTablet) return tabletSize;
        return desktopSize;
    };

    const availableWidth = Math.min(width - (shouldCollapseSidebar ? 32 : 64), 900);
    const sectionWidth = availableWidth / itemsToShow;

    const getBookDimensions = () => {
        const maxWidth = Math.min(sectionWidth * 0.22, getResponsiveSize(60, 75, 85));
        const baseHeight = maxWidth * 1.67;
        return {
            width: maxWidth,
            height: Math.min(baseHeight, getResponsiveSize(100, 130, 145)),
            overlap: Math.max(maxWidth * 0.15, 8)
        };
    };

    const getPaperDimensions = () => {
        const maxWidth = Math.min(sectionWidth * 0.25, getResponsiveSize(70, 85, 95));
        const baseHeight = maxWidth * 1.4;
        return {
            width: maxWidth,
            height: Math.min(baseHeight, getResponsiveSize(95, 120, 135)),
            overlap: Math.max(maxWidth * 0.18, 10)
        };
    };

    const getEssayDimensions = () => {
        const maxWidth = Math.min(sectionWidth * 0.20, getResponsiveSize(50, 65, 75));
        const baseHeight = maxWidth * 1.73;
        return {
            width: maxWidth,
            height: Math.min(baseHeight, getResponsiveSize(85, 110, 125)),
            overlap: Math.max(maxWidth * 0.12, 6)
        };
    };

    const bookshelfSectionStyle = {
        maxWidth: getResponsiveSize('100%', '800px', '900px'),
        width: '100%',
        marginTop: getResponsiveSize('2rem', '3rem', '4rem'),
        transition: 'all 0.3s ease',
        padding: getResponsiveSize('0 0.5rem', '0 1rem', '0'),
        boxSizing: 'border-box',
        overflow: 'hidden'
    };

    const bookshelfTitleStyle = {
        fontSize: getResponsiveSize('1.6rem', '2rem', '2.2rem'),
        fontWeight: 600,
        color: theme.colors.text,
        marginBottom: getResponsiveSize('1.5rem', '2rem', '2rem'),
        textAlign: 'center',
        transition: 'font-size 0.3s ease'
    };

    const bookshelfContainerStyle = {
        position: 'relative',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box'
    };

    const shelfStyle = {
        position: 'relative',
        width: '100%',
        height: getResponsiveSize('10px', '14px', '16px'),
        background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #654321 100%)',
        borderRadius: getResponsiveSize('5px 5px 2px 2px', '7px 7px 3px 3px', '8px 8px 4px 4px'),
        boxShadow: '0 4px 12px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.2)',
        marginBottom: '1rem',
        zIndex: 1,
        transition: 'all 0.3s ease'
    };

    const booksContainerStyle = {
        position: 'relative',
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'flex-end',
        width: '100%',
        marginBottom: '0',
        zIndex: 2,
        gap: itemsToShow === 1 ? '0' : getResponsiveSize('0.5rem', '1rem', '1.5rem'),
        boxSizing: 'border-box',
        overflow: 'hidden'
    };

    const stackStyle = {
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        flex: itemsToShow === 1 ? 'none' : 1,
        maxWidth: itemsToShow === 1 ? 'none' : `${Math.min(sectionWidth, 300)}px`,
        minWidth: 0
    };

    const bookDimensions = getBookDimensions();
    const paperDimensions = getPaperDimensions();
    const essayDimensions = getEssayDimensions();

    const baseItemStyle = {
        borderRadius: '2px 2px 0 0',
        boxShadow: '2px 0 6px rgba(0,0,0,0.3)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        objectFit: 'cover',
        border: '1px solid rgba(0,0,0,0.1)',
        flexShrink: 0
    };

    const createStackStyles = (dimensions, count = 3) => {
        if (count === 1) {
            return [{
                ...baseItemStyle,
                height: `${dimensions.height}px`,
                width: `${dimensions.width}px`,
                zIndex: 1
            }];
        }
        if (count === 2) {
            return [
                { ...baseItemStyle, height: `${dimensions.height}px`, width: `${dimensions.width}px`, zIndex: 1, marginRight: `-${dimensions.overlap}px` },
                { ...baseItemStyle, height: `${dimensions.height}px`, width: `${dimensions.width}px`, zIndex: 2 }
            ];
        }
        return [
            { ...baseItemStyle, height: `${dimensions.height}px`, width: `${dimensions.width}px`, zIndex: 1, marginRight: `-${dimensions.overlap}px` },
            { ...baseItemStyle, height: `${dimensions.height}px`, width: `${dimensions.width + 3}px`, zIndex: 2, marginRight: `-${dimensions.overlap - 3}px` },
            { ...baseItemStyle, height: `${dimensions.height}px`, width: `${dimensions.width - 2}px`, zIndex: 3 }
        ];
    };

    const bookStyles = createStackStyles(bookDimensions, itemsToShow);
    const paperStyles = createStackStyles(paperDimensions, itemsToShow);
    const essayStyles = createStackStyles(essayDimensions, itemsToShow);

    const categoriesContainerStyle = {
        display: 'flex',
        justifyContent: 'space-evenly',
        width: '100%',
        marginTop: '1rem',
        gap: getResponsiveSize('0.5rem', '1rem', '0'),
        boxSizing: 'border-box'
    };

    const categoryStyle = {
        fontSize: getResponsiveSize('0.8rem', '0.95rem', '1.1rem'),
        fontWeight: 500,
        color: theme.colors.text,
        textAlign: 'center',
        transition: 'font-size 0.3s ease',
        flex: 1,
        minWidth: 0
    };

    const books = [
        { src: bookCover1, alt: "Beyond the Ogdoad", color: '#4A90E2' },
        { src: bookCover2, alt: "The Hobbit", color: '#7ED321' },
        { src: bookCover3, alt: "Book 3", color: '#F5A623' }
    ].slice(0, itemsToShow);

    const essays = [
        { src: essay1, alt: "Essay 1", color: '#BD10E0' },
        { src: essay2, alt: "Essay 2", color: '#B8E986' },
        { src: essay3, alt: "Essay 3", color: '#50E3C2' }
    ].slice(0, itemsToShow);

    const papers = [
        { src: researchPaper1, alt: "Research Paper 1", color: '#E67E22' },
        { src: researchPaper2, alt: "Research Paper 2", color: '#9B59B6' },
        { src: researchPaper3, alt: "Research Paper 3", color: '#2ECC71' }
    ].slice(0, itemsToShow);

    const categories = ['Books', 'Research Papers', 'Essays'].slice(0, itemsToShow);

    return (
        <div style={bookshelfSectionStyle}>
            <h2 style={bookshelfTitleStyle}><a href="/bookshelf" style={{ color: theme.colors.text, textDecoration: 'none' }}>Bookshelf</a></h2>

            <div style={bookshelfContainerStyle}>
                <div style={booksContainerStyle}>
                    {/* Books */}
                    {itemsToShow >= 1 && (
                        <div style={stackStyle}>
                            {books.map((book, index) => (
                                <a href="/bookshelf" key={`book-link-${index}`} style={{ display: 'inline-block', cursor: 'pointer' }}>
                                    <img
                                        key={`book-${index}`}
                                        src={book.src}
                                        alt={book.alt}
                                        style={{ ...bookStyles[index], display: 'block' }}
                                        onError={(e) => {
                                            e.target.style.backgroundColor = book.color;
                                            e.target.style.display = 'block';
                                            e.target.alt = '';
                                        }}
                                    />
                                </a>
                            ))}
                        </div>
                    )}

                    {/* Research Papers */}
                    {itemsToShow >= 2 && (
                        <div style={stackStyle}>
                            {papers.map((paper, index) => (
                                <a href="/bookshelf" key={`paper-link-${index}`} style={{ display: 'inline-block', cursor: 'pointer' }}>
                                    <img
                                        key={`paper-${index}`}
                                        src={paper.src}
                                        alt={paper.alt}
                                        style={{ ...paperStyles[index], display: 'block' }}
                                        onError={(e) => {
                                            e.target.style.backgroundColor = paper.color;
                                            e.target.style.display = 'block';
                                            e.target.alt = '';
                                        }}
                                    />
                                </a>
                            ))}
                        </div>
                    )}

                    {/* Essays */}
                    {itemsToShow >= 3 && (
                        <div style={stackStyle}>
                            {essays.map((essay, index) => (
                                <a href="/bookshelf" key={`essay-link-${index}`} style={{ display: 'inline-block', cursor: 'pointer' }}>
                                    <img
                                        key={`essay-${index}`}
                                        src={essay.src}
                                        alt={essay.alt}
                                        style={{ ...essayStyles[index], display: 'block' }}
                                        onError={(e) => {
                                            e.target.style.backgroundColor = essay.color;
                                            e.target.style.display = 'block';
                                            e.target.alt = '';
                                        }}
                                    />
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                {/* Shelf */}
                <div style={shelfStyle}></div>

                {/* Categories */}
                <div style={categoriesContainerStyle}>
                    {categories.map((category, index) => (
                        <div key={index} style={categoryStyle}>{category}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BookshelfSection;
