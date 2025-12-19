import * as admin from 'firebase-admin';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
    onModuleInit() {
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.applicationDefault(), // Expects GOOGLE_APPLICATION_CREDENTIALS or default env
                projectId: 'training-proj-a872a'
            });
        }
    }

    getAuth() {
        return admin.auth();
    }
}
