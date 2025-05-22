"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.logout = logout;
exports.signup = signup;
exports.searchUsers = searchUsers;
exports.get = get;
exports.update = update;
const user_model_1 = __importDefault(require("./user.model"));
const friend_model_1 = __importDefault(require("../friend/friend.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_service_1 = require("../auth/auth.service");
function login(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = data;
        const user = yield user_model_1.default.findOne({ username });
        if (!user)
            return false;
        if (!user.comparePassword(password))
            return false;
        const accessToken = (0, auth_service_1.generateAccessToken)({
            userId: user._id,
            username: user.username,
        });
        const refreshToken = (0, auth_service_1.generateRefreshToken)({
            userId: user._id,
            username: user.username,
        });
        return { accessToken, refreshToken };
    });
}
function logout() {
    return __awaiter(this, void 0, void 0, function* () { return; });
}
function signup(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const newUser = new user_model_1.default(data);
        newUser.hashPassword = bcryptjs_1.default.hashSync(data.password, 10);
        const savedUser = yield newUser.save();
        /* admin automatically adds friends for each new user  */
        /* const adminUser = await User.findOne({ username: "admin" });
        if (adminUser) {
          const newFriendRequest = new FriendRequest({
            sender: savedUser._id,
            receiver: adminUser._id,
            status: "accepted",
          });
          await newFriendRequest.save();
      
          await User.updateOne(
            { _id: adminUser._id },
            { $addToSet: { friends: savedUser._id } }
          );
          await User.updateOne(
            { _id: savedUser._id },
            { $addToSet: { friends: adminUser._id } }
          );
        }
        */
        return savedUser ? true : false;
    });
}
function searchUsers(query, currentUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        const regex = new RegExp(query, "i");
        const currentUser = yield user_model_1.default.findById(currentUserId).select("friends");
        const friendIds = (currentUser === null || currentUser === void 0 ? void 0 : currentUser.friends.map(id => id.toString())) || [];
        const incomingRequests = yield friend_model_1.default.find({
            to: currentUserId,
            status: "pending",
        }).select("from");
        const incomingRequestIds = incomingRequests.map(req => req.from.toString());
        const excludeIds = [
            currentUserId,
            ...friendIds,
            ...incomingRequestIds
        ];
        const users = yield user_model_1.default.find({
            $or: [
                { username: regex },
                { name: regex },
                { surname: regex },
            ],
            _id: { $nin: excludeIds }
        }).select("_id username name surname photo");
        const outgoingRequests = yield friend_model_1.default.find({
            from: currentUserId,
            status: "pending",
            to: { $in: users.map(u => u._id) }
        }).select("to");
        const outgoingMap = new Set(outgoingRequests.map(req => req.to.toString()));
        return users.map((user) => ({
            _id: user._id.toString(),
            username: user.username,
            name: user.name,
            surname: user.surname,
            photo: user.photo,
            hasPendingRequest: outgoingMap.has(user._id.toString())
        }));
    });
}
function get(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return user_model_1.default.findById(id);
    });
}
function update(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return user_model_1.default.findOneAndUpdate({ _id: id }, data);
    });
}
