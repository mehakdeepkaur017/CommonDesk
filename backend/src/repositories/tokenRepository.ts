import prisma from "../lib/prisma";

export const saveRefreshToken = async (token: string, userId: string, expiresInDays: number = 7) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);

  return prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });
};

export const findRefreshToken = async (token: string) => {
  return prisma.refreshToken.findUnique({ where: { token } });
};

export const deleteRefreshToken = async (token: string) => {
  return prisma.refreshToken.delete({ where: { token } }).catch(() => null);
};
