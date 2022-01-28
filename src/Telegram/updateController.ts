import updateService from "./updateService";


const insertUserId = async ( chatId : number ) => {
    try {
        const getChatIdRes = await updateService.getByUserId(chatId);
        
        if (!getChatIdRes) {
            await updateService.insertUserId(chatId);
            console.log("Successfully Inserted!");
        } else {
            console.log("already exists");
        }

        return getChatIdRes;
    } catch (err) {
        console.error(err);
    }
};

const getAllUserId = async () => {
    try {
        const getAllUserIdRes = await updateService.getAllUserId();
        
        return getAllUserIdRes;
    } catch (err) {
        console.error(err);
    };
}

const deleteUserId = async ( chatId: number ) => {
    const userId: number = chatId;

    try {
        const getChatIdRes = await updateService.getByUserId(userId);
        
        if (getChatIdRes) {
            await updateService.deleteUserId(userId);
            console.log("Successfully deleted!");
        } else {
            console.log("User not exist");
        }
    } catch (err) {
        console.error(err);
    }
}


export {
    insertUserId,
    getAllUserId,
    deleteUserId,
}