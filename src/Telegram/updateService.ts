import pool from "../../config/database";
import updateDao from "./updateDao";



const getByUserId = async (chatId: number) => {
    try {
        const connection = await pool.getConnection();
        const getUserIdRes = await updateDao.getByUserId(connection, chatId);
        connection.release();

        return getUserIdRes;
    } catch(err) {
        console.error(err);
    };
};

const insertUserId = async (chatId: number) => {
    try {
        const connection = await pool.getConnection();
        const insertUserIdRes = await updateDao.insertUserId(connection, chatId);
        connection.release();

        return insertUserIdRes;
    
    } catch (err) {
        console.error(err);
    }
}

const getAllUserId = async () => {
    try {
        const connection = await pool.getConnection();
        const getAllUserIdRes = await updateDao.getAllUserId(connection);
        connection.release();
        
        return getAllUserIdRes;

    } catch(err) {
        console.error(err);
    }
}

const deleteUserId = async (userId: number) => {
    try {
        const connection = await pool.getConnection();
        await updateDao.deleteUserId(connection, userId);
        connection.release();
        
    } catch(err) {
        console.error(err);
    }
}

export default {
    getByUserId,
    insertUserId,
    getAllUserId,
    deleteUserId,
};