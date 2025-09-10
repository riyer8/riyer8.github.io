import React from 'react';
import { useTheme } from '../../context/ThemeContext';

import bookCover1 from '../../assets/bookshelf/books/book1.png';
import bookCover2 from '../../assets/bookshelf/books/book2.jpg';
import bookCover3 from '../../assets/bookshelf/books/book3.png';

import essay1 from '../../assets/bookshelf/books/book1.png';
import essay2 from '../../assets/bookshelf/books/book2.jpg';
import essay3 from '../../assets/bookshelf/books/book3.png';

const BookshelfSection = ({ screenSize }) => {
    const { theme } = useTheme();
    const { width, shouldCollapseSidebar } = screenSize;

    // Determine how many items to show based on available space
    const getItemsToShow = () => {
        if (width < 380) return 1; // Very small screens - show only 1 item
        if (width < 600) return 2; // Small screens - show 2 items
        return 3; // Normal screens - show all 3 items
    };

    const itemsToShow = getItemsToShow();

    // Responsive sizing calculations
    const getResponsiveSize = (mobileSize, tabletSize, desktopSize) => {
        if (shouldCollapseSidebar) return mobileSize;
        if (screenSize.isTablet) return tabletSize;
        return desktopSize;
    };

    // Calculate available width per section with better overflow protection
    const availableWidth = Math.min(width - (shouldCollapseSidebar ? 32 : 64), 900); // Max width constraint
    const sectionWidth = availableWidth / itemsToShow;

    // Dynamic dimensions based on available space
    const getBookDimensions = () => {
        const maxWidth = Math.min(sectionWidth * 0.22, getResponsiveSize(60, 75, 85));
        const baseHeight = maxWidth * 1.67; // Maintain aspect ratio
        
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
        overflow: 'hidden' // Prevent horizontal overflow
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
        overflow: 'hidden' // Prevent overflow
    };

    const bookStackStyle = {
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        flex: itemsToShow === 1 ? 'none' : 1,
        maxWidth: itemsToShow === 1 ? 'none' : `${Math.min(sectionWidth, 300)}px`, // Max width constraint
        minWidth: 0 // Allow shrinking
    };

    const bookDimensions = getBookDimensions();
    const paperDimensions = getPaperDimensions();
    const essayDimensions = getEssayDimensions();

    // Base book style
    const bookStyle = {
        height: `${bookDimensions.height}px`,
        borderRadius: '2px 2px 0 0',
        boxShadow: '2px 0 6px rgba(0,0,0,0.3)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        objectFit: 'cover',
        border: '1px solid rgba(0,0,0,0.1)',
        flexShrink: 0 // Prevent shrinking
    };

    const createBookStyles = (dimensions, count = 3) => {
        if (count === 1) {
            return [{
                ...bookStyle,
                height: `${dimensions.height}px`,
                width: `${dimensions.width}px`,
                zIndex: 1
            }];
        }
        
        if (count === 2) {
            return [
                {
                    ...bookStyle,
                    height: `${dimensions.height}px`,
                    width: `${dimensions.width}px`,
                    zIndex: 1,
                    marginRight: `-${dimensions.overlap}px`
                },
                {
                    ...bookStyle,
                    height: `${dimensions.height}px`,
                    width: `${dimensions.width}px`,
                    zIndex: 2
                }
            ];
        }
        
        // 3 items
        return [
            {
                ...bookStyle,
                height: `${dimensions.height}px`,
                width: `${dimensions.width}px`,
                zIndex: 1,
                marginRight: `-${dimensions.overlap}px`
            },
            {
                ...bookStyle,
                height: `${dimensions.height}px`,
                width: `${dimensions.width + 3}px`,
                zIndex: 2,
                marginRight: `-${dimensions.overlap - 3}px`
            },
            {
                ...bookStyle,
                height: `${dimensions.height}px`,
                width: `${dimensions.width - 2}px`,
                zIndex: 3
            }
        ];
    };

    // Paper styles
    const paperStyle = {
        backgroundColor: '#FFFFFF',
        borderRadius: '2px 2px 0 0',
        boxShadow: '2px 0 4px rgba(0,0,0,0.2)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        border: '1px solid #E0E0E0',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        padding: getResponsiveSize('6px 4px', '10px 6px', '12px 8px'),
        fontSize: getResponsiveSize('5px', '6px', '7px'),
        color: '#333',
        lineHeight: '1.2',
        flexShrink: 0 // Prevent shrinking
    };

    const createPaperStyles = (dimensions, count = 3) => {
        const basePaper = {
            ...paperStyle,
            height: `${dimensions.height}px`,
            width: `${dimensions.width}px`
        };

        if (count === 1) {
            return [{ ...basePaper, zIndex: 1 }];
        }
        
        if (count === 2) {
            return [
                { ...basePaper, zIndex: 1, marginRight: `-${dimensions.overlap}px` },
                { ...basePaper, zIndex: 2 }
            ];
        }
        
        return [
            { ...basePaper, zIndex: 1, marginRight: `-${dimensions.overlap}px` },
            { ...basePaper, zIndex: 2, marginRight: `-${dimensions.overlap - 5}px` },
            { ...basePaper, zIndex: 3 }
        ];
    };

    const bookStyles = createBookStyles(bookDimensions, itemsToShow);
    const paperStyles = createPaperStyles(paperDimensions, itemsToShow);
    const essayStyles = createBookStyles(essayDimensions, itemsToShow);

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
        minWidth: 0 // Allow text truncation if needed
    };

    const paperTitleFontSize = getResponsiveSize('5px', '6px', '7px');
    const paperAuthorFontSize = getResponsiveSize('4px', '5px', '6px');
    const paperDetailsFontSize = getResponsiveSize('3px', '4px', '5px');

    // Book data arrays
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

    const papers = Array(itemsToShow).fill().map((_, index) => ({
        title: "Title of your Paper",
        author: "Author",
        venue: "Conference/Journal",
        year: "Year"
    }));

    const categories = ['Books', 'Research Papers', 'Essays'].slice(0, itemsToShow);

    return (
        <div style={bookshelfSectionStyle}>
            <h2 style={bookshelfTitleStyle}>Bookshelf</h2>
            
            <div style={bookshelfContainerStyle}>
                <div style={booksContainerStyle}>
                    {/* Books Stack */}
                    {itemsToShow >= 1 && (
                        <div style={bookStackStyle}>
                            {books.map((book, index) => (
                                <img 
                                    key={`book-${index}`}
                                    src={book.src} 
                                    alt={book.alt}
                                    style={bookStyles[index]}
                                    onError={(e) => {
                                        e.target.style.backgroundColor = book.color;
                                        e.target.style.display = 'block';
                                        e.target.alt = '';
                                    }}
                                />
                            ))}
                        </div>
                    )}
                    
                    {/* Research Papers Stack */}
                    {itemsToShow >= 2 && (
                        <div style={bookStackStyle}>
                            {papers.map((paper, index) => (
                                <div key={`paper-${index}`} style={paperStyles[index]}>
                                    <div style={{fontSize: paperTitleFontSize, fontWeight: 'bold', marginBottom: getResponsiveSize('3px', '4px', '5px')}}>{paper.title}</div>
                                    <div style={{fontSize: paperAuthorFontSize, marginBottom: getResponsiveSize('2px', '2px', '3px')}}>{paper.author}</div>
                                    <div style={{fontSize: paperDetailsFontSize, color: '#666'}}>{paper.venue}</div>
                                    <div style={{fontSize: paperDetailsFontSize, color: '#666'}}>{paper.year}</div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* Essays Stack */}
                    {itemsToShow >= 3 && (
                        <div style={bookStackStyle}>
                            {essays.map((essay, index) => (
                                <img 
                                    key={`essay-${index}`}
                                    src={essay.src} 
                                    alt={essay.alt}
                                    style={essayStyles[index]}
                                    onError={(e) => {
                                        e.target.style.backgroundColor = essay.color;
                                        e.target.style.display = 'block';
                                        e.target.alt = '';
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Wooden Shelf */}
                <div style={shelfStyle}></div>
                
                {/* Category Labels */}
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