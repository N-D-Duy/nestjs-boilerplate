import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { UserDocument } from "./schema/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { hashPassword } from "src/shared/utils/hash-password.utils";

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    getUsers(): Promise<UserDocument[]> {
        return this.userRepository.findAll();
    }

    getUserById(id: string): Promise<UserDocument> {
        return this.userRepository.findById(id);
    }

    async create(createUserDto: CreateUserDto): Promise<UserDocument> {
        if (!createUserDto.status) {
            createUserDto.status = 'inactive';
        }
        //hash password
        const hashedPassword = await hashPassword(createUserDto.password);
        const user = {...createUserDto, password: hashedPassword};
        return this.userRepository.create(user);
    }
    findByEmail(email: string): Promise<UserDocument> {
        return this.userRepository.findByEmail(email);
    }

}