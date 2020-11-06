import { getRepository, In } from 'typeorm';

import Category from '../models/Category';

interface Request {
  categoryTitles: string[];
}

interface Response {
  categoriesFound: Category[];
  categoriesTitlesCreated: string[];
}

/* eslint-disable class-methods-use-this, camelcase */
class CheckCategoriesFromListService {
  public async execute({ categoryTitles }: Request): Promise<Response> {
    const categoryRepository = getRepository(Category);
    let categoriesFound: Category[] = [];

    categoriesFound = await categoryRepository.find({
      where: {
        title: In(categoryTitles),
      },
    });

    const categoriesTitlesFound = categoriesFound.map(({ title }) => title);

    // prettier-ignore
    const categoriesTitlesCreated = categoryTitles
      .filter( // remove existent categories titles
        (categoryTitle) => !categoriesTitlesFound.includes(categoryTitle),
      )
      .filter( // remove duplicated values
        (categoryTitle, index, selfArr) => selfArr.indexOf(categoryTitle) === index,
      );

    console.log(categoriesTitlesCreated);

    return { categoriesFound, categoriesTitlesCreated };
  }
}

export default CheckCategoriesFromListService;
