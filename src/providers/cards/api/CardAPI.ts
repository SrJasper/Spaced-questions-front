import { fetchAPI } from "helpers/fetch";
import { GetCardsAPIResponse } from "../types";
import { UserDontExistError } from "../erros";

export const requestCardFromUserNotebook = async (login: string, notebook: string) => {

    const response = await fetchAPI(`/user/cards/${login}/${notebook}`)

    if (response.status === 401) throw new UserDontExistError(
        `The user ${login} dosn't exist`
    );

    return response.json() as unknown as GetCardsAPIResponse;

}