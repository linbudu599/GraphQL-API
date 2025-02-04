import {
  Resolver,
  Query,
  Arg,
  Mutation,
  InputType,
  Field,
  Authorized
} from "type-graphql";
import { Length, IsString } from "class-validator";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

import checkIfExist from "../util/checkIfExist";

import { UserStatusHandler } from "../util/statusHandler";

import { tokenGenerator, tokenVerifier } from "../util/token";

import { User, Status } from "../schema/user";

@InputType()
export class UserInput {
  @Length(3, 15, { message: "account length: 3-15" })
  @IsString()
  @Field()
  account!: string;

  @Length(6, 12, { message: "secret length: 6-12" })
  @IsString()
  @Field()
  secret!: string;
}

@Resolver(() => User)
export class UserResolver {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  @Mutation(() => Status, { nullable: true })
  async Login(
    @Arg("account") account: string,
    @Arg("secret") secret: string
  ): Promise<Status> {
    // check if account exists
    const isExisted = await checkIfExist(
      this.userRepository,
      {
        account,
        secret
      },
      true
    );

    return isExisted
      ? new UserStatusHandler(
          10000,
          tokenGenerator((isExisted as User).uid, account),
          "success"
        )
      : new UserStatusHandler(10001, "Invalid Login Request Params", "failure");
  }

  // Just for test
  @Authorized()
  @Query(() => [User])
  async Users(): Promise<User[]> {
    return await this.userRepository.find();
  }

  @Mutation(() => Status)
  // @Arg("user") { account, secret }: UserInput
  async Register(
    @Arg("account") account: string,
    @Arg("secret") secret: string
  ): Promise<Status> {
    const isExisted = await checkIfExist(this.userRepository, { account });

    if (isExisted) {
      return new UserStatusHandler(10002, "x", "Account Existed");
    }

    const newUser = this.userRepository.create({
      account,
      secret
    });

    try {
      const res = await this.userRepository.save(newUser);
      return new UserStatusHandler(
        10000,
        tokenGenerator(res.uid, account),
        "suuccess"
      );
    } catch (err) {
      return new UserStatusHandler(10010, "error", err);
    }
  }

  @Mutation(() => Status)
  async Destory(
    @Arg("account") account: string,
    @Arg("secret") secret: string
  ): Promise<Status> {
    const accountInfo = await checkIfExist(this.userRepository, {
      account,
      secret
    });
    if (!accountInfo) {
      return new UserStatusHandler(10003, "x", "Account Dosen't Exist");
    }

    try {
      await this.userRepository.delete({ account, secret });
      return new UserStatusHandler(10000, "", "destory account suuccess");
    } catch (err) {
      return new UserStatusHandler(10010, "error", err);
    }
  }
}
