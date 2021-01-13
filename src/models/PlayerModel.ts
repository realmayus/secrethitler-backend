import bcrypt from "bcrypt";
import mongoose, { Document, Schema } from "mongoose";

const SALT_WORK_FACTOR = 10;

export interface IUser extends Document {
    isModified(arg0: string);
	username: string,
	email: string,
	userID: number,
	password: string,
	avatar: string,
	matchesPlayed?: number,
	timePlayed?: number,
	matchesWon?: number,
	matchesLost?: number,
	isModerator: boolean
}

const schema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: { type: String, required: true },
	username: {
		type: String,
		required: true,
		unique: true
	},
	userID: {
		type: Number,
		required: true,
		unique: true
	},
	avatar: {
		type: String,
		required: false
	},
	matchesPlayed: {
		type: Number,
		required: false
	},
	timePlayed: {
		type: Number,
		required: false
	},
	matchesWon: {
		type: Number,
		required: false
	},
	matchesLost: {
		type: Number,
		required: false
	},
	isModerator: {
		type: Boolean,
		required: true
	}
});


schema.pre('save', async function(next: () => void) {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const that = this as IUser
	// only hash the password if it has been modified (or is new)
	if (!that.isModified('password')) return next();

	// generate a salt
	const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
	that.password = await bcrypt.hash(that.password, salt);
	next();
});


// export function authenticate(username: string, password: string): Promise<any> {
// 	return model.findOne({ username: username })
// 		.exec(function (err: any, user: any) {
// 			if (err) {
// 				throw new Error(err)
// 			} else if (!user) {
// 				throw new Error("User not found")
// 			}
// 			if (bcrypt.compareSync(password, user.password)) {
// 				return user;
// 			} else {
// 				return undefined;
// 			}
// 	});
// }

schema.methods.validatePassword = async function validatePassword(data: any) {
	return bcrypt.compare(data, this.password);
};

export async function authenticate(username: string, password: string): Promise<IUser | undefined> {
	const user: any = await model.findOne({username}).exec()
	if (user == null) {
		return undefined;
	}
	const x = await bcrypt.compare(password, user.password);
	return x ? user : undefined;
}

const model = mongoose.model('Player', schema);
export default model;