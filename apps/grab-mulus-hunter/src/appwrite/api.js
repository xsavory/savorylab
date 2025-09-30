import { databases, appwriteConfig } from './config';
import { ID, Query } from 'appwrite';

export const scoreAPI = {
    // Save score to Appwrite
    async saveScore(username, score) {
        try {
            const response = await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.scoresCollectionId,
                ID.unique(),
                {
                    username: username,
                    score: score,
                    $createdAt: new Date().toISOString()
                }
            );
            return { success: true, data: response };
        } catch (error) {
            console.error('Error saving score:', error);
            return { success: false, error: error.message };
        }
    },

    // Get top scores for leaderboard
    async getTopScores(limit = 10) {
        try {
            const response = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.scoresCollectionId,
                [
                    Query.orderDesc('score'),
                    Query.limit(limit)
                ]
            );
            return { success: true, data: response.documents };
        } catch (error) {
            console.error('Error fetching scores:', error);
            return { success: false, error: error.message };
        }
    },

    // Check if username already exists
    async checkUsernameExists(username) {
        try {
            const response = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.scoresCollectionId,
                [
                    Query.equal('username', username),
                    Query.limit(1)
                ]
            );

            // If any documents found, username exists
            const exists = response.documents.length > 0;
            return {
                success: true,
                exists: exists,
                data: response.documents
            };
        } catch (error) {
            console.error('Error checking username:', error);
            return {
                success: false,
                exists: false,
                error: error.message
            };
        }
    }
};