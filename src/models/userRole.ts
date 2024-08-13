// model UserRole {
//   id       Int      @id @default(autoincrement())
//   user_id  Int
//   role_name String  @db.Char(8)

//   user User @relation(fields: [user_id], references: [id], onDelete: Cascade)
// }

interface UserRole {
  id: number;
  user_id: number;
  role_name: string;
}