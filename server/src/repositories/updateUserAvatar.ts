import prisma from './prisma';

export async function updateUserAvatar(userId: string, avatarUrl: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { avatar: avatarUrl },
    select: { id: true, avatar: true },
  });
}
