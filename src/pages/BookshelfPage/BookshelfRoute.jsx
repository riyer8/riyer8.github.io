import React from "react";
import { useParams } from "react-router-dom";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import BookshelfPage from "./BookshelfPage";
import bookshelfData from "./data/bookshelfData";
import { titleToSlug } from "./bookshelfUtils";

const BookshelfRoute = () => {
  const { slug } = useParams();
  const hasMatchingItem =
    !slug ||
    bookshelfData.some(
      (item) => titleToSlug(item.title) === decodeURIComponent(slug)
    );

  return hasMatchingItem ? <BookshelfPage /> : <NotFoundPage />;
};

export default BookshelfRoute;
