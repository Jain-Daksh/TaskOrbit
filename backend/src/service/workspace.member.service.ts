import { prisma } from '../../prisma/client';

export class WorkspaceMemberService {
  async getWorkspaceMembers(workspaceId: string, userId: string) {
    const isMember = await prisma.workspaceMember.findFirst({
      where: { workspaceId, userId },
    });
    if (!isMember) throw new Error('You are not a member of this workspace');

    return prisma.workspaceMember.findMany({
      where: { workspaceId },
      include: {
        user: true,
        role: true,
      },
    });
  }

  async addWorkspaceMember(
    workspaceId: string,
    adminUserId: string,
    newUserId: string,
    roleName: string = 'Member',
  ) {
    const adminRole = await prisma.role.findFirst({ where: { name: 'Admin' } });
    if (!adminRole) throw new Error('Admin role not found');

    const isAdmin = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: adminUserId,
        roleId: adminRole.id,
      },
    });
    if (!isAdmin) throw new Error('Only admins can add members');

    const existingMember = await prisma.workspaceMember.findFirst({
      where: { workspaceId, userId: newUserId },
    });
    if (existingMember) throw new Error('User is already a member');

    const role = await prisma.role.findFirst({ where: { name: roleName } });
    if (!role) throw new Error(`Role '${roleName}' not found`);

    return prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId: newUserId,
        roleId: role.id,
      },
    });
  }

  async removeWorkspaceMember(
    workspaceId: string,
    adminUserId: string,
    memberUserId: string,
  ) {
    const adminRole = await prisma.role.findFirst({ where: { name: 'Admin' } });
    if (!adminRole) throw new Error('Admin role not found');

    const isAdmin = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: adminUserId,
        roleId: adminRole.id,
      },
    });
    if (!isAdmin) throw new Error('Only admins can remove members');

    if (adminUserId === memberUserId)
      throw new Error('Admin cannot remove self');

    const member = await prisma.workspaceMember.findFirst({
      where: { workspaceId, userId: memberUserId },
    });
    if (!member) throw new Error('User is not a member of this workspace');

    return prisma.workspaceMember.delete({
      where: { id: member.id },
    });
  }
}
