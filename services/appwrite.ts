import { Client, Databases, ID, Query, Account } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const USERS_COLLECTION_ID =
    process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;

const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);
const account = new Account(client);

export const createUser = (email: string, password: string, name: string) =>
    account.create(ID.unique(), email, password, name);

export const login = (email: string, password: string) =>
    account.createEmailSession(email, password);

export const getCurrentUser = () => account.get();

export const logout = () => account.deleteSession("current");

export const createUserDocument = (
    userId: string,
    name: string,
    email: string
) =>
    database.createDocument(DATABASE_ID, USERS_COLLECTION_ID, userId, {
        name,
        email,
    });

export const updateSearchCount = async (query: string, movie: Movie) => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal("searchTerm", query),
        ]);

        if (result.documents.length > 0) {
            const existingMovie = result.documents[0];
            await database.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                existingMovie.$id,
                {
                    count: existingMovie.count + 1,
                }
            );
        } else {
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchTerm: query,
                movie_id: movie.id,
                title: movie.title,
                count: 1,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            });
        }
    } catch (error) {
        console.error("Error updating search count:", error);
        throw error;
    }
};

export const getTrendingMovies = async (): Promise<
    TrendingMovie[] | undefined
> => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc("count"),
        ]);

        return result.documents as unknown as TrendingMovie[];
    } catch (error) {
        console.error(error);
        return undefined;
    }
};