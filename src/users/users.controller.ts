import { Controller, Get, Post, Body, UseGuards, Request, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { userAddresses } from '../drizzle/schema';

@Controller('users')
@UseGuards(FirebaseAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('sync')
    async syncUser(@Request() req) {
        // req.user contains the decoded Firebase token with .uid, .email, etc.
        return this.usersService.syncUser(req.user);
    }

    @Post('addresses')
    async addAddress(@Request() req, @Body() body: typeof userAddresses.$inferInsert) {
        const firebaseUid = req.user.uid;
        return this.usersService.addAddress(firebaseUid, body);
    }

    @Get('addresses')
    async getAddresses(@Request() req) {
        const firebaseUid = req.user.uid;
        return this.usersService.getAddresses(firebaseUid);
    }
}
