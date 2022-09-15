import dotenv from 'dotenv';
dotenv.config();

export let daoMessages;
export let daoProducts;

switch (process.env.DATA_PERSISTENCE) {
    case 'MONGO':
		const { default: mongoMessageDao } = await import('../daos/mongoMessageDao.js');
		const { default: mongoProductDao } = await import('../daos/mongoProductDao.js');
		daoMessages = new mongoMessageDao();
		daoProducts = new mongoProductDao();
		break;
	case 'FIREBASE':
		const { default: firebaseMessageDao } = await import('../daos/firebaseMessageDao.js');
		const { default: firebaseProductDao } = await import('../daos/firebaseProductDao.js');
        daoMessages = new firebaseMessageDao();
		daoProducts = new firebaseProductDao();
		break;
    default:
		const { default: fileMessageDao } = await import('../daos/fileMessageDao.js');
		const { default: fileProductDao } = await import('../daos/fileProductDao.js');
        daoProducts = new fileProductDao('products');
        daoMessages = new fileMessageDao('messages');
		break;    
}