import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("test_users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  username!: string; // 用户名
  @Column()
  password!: string; // 加密后的密码
  @Column()
  email!: string; // 邮箱
  @Column()
  create_time!: number; //创建时间
  @Column()
  update_time!: number; //更新时间
  @Column()
  is_delete!: boolean;

  static create(data: Partial<User>) {
    let time = Math.floor(Date.now() / 1000);
    data.create_time = data.create_time || time;
    data.update_time = data.update_time || time;
    data.is_delete = data.is_delete || false;
    return data;
  }
}
