import { createClient } from '@supabase/supabase-js'
import { Database } from './supabase-types.js';
import pino from 'pino';
const logger = pino();

const supabase = createClient<Database>(
    'https://rkageyxjkwpdbggemyhk.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrYWdleXhqa3dwZGJnZ2VteWhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ3ODU0ODcsImV4cCI6MjAyMDM2MTQ4N30.akRvKXbWEheDmKICpCs07qFCs5qY0DkJmhQ0YoSXw_0'
);

async function SignInWithTwitch() : Promise<boolean> {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'twitch',
    });
    if (error) {
        logger.error(`SignInWithTwitch: `, error);
        return false;
    } 
    return true;
}

export async function GetAonyxBuddyInstanceConfig(nickname?: string, retry: boolean = true) {
    const { data, error } = await supabase
        .schema('aonyxbuddy_public')
        .from('instances')
        .select(`*, owner:users!inner(username)`);

    if (error || !data || data.length < 1) {
        if (error) {
            logger.error(error);
        } else if (!data) {
            logger.error(`data is undefined`);
        } else {
            logger.error(`data length is ${data.length}`);
        }

        if (retry) {
            await SignInWithTwitch();
            await GetAonyxBuddyInstanceConfig(nickname, false)
            return;
        } {
            return;
        }
    }

    data.forEach(row => {
        if (row?.instance_nickname === nickname) {
            return row;
        }
    });

    return data[0];
}

