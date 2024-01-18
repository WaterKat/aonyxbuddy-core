//import { IClientConfig } from '../database/legacy/iclient-config.js';
//import { IAonyxBuddyInstance } from '../database/config-types.js';
import { DefaultAonyxBuddyConfiguration as defaultConfig } from './client-config-default.js';


import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabase = createClient(
    'https://rkageyxjkwpdbggemyhk.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrYWdleXhqa3dwZGJnZ2VteWhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ3ODU0ODcsImV4cCI6MjAyMDM2MTQ4N30.akRvKXbWEheDmKICpCs07qFCs5qY0DkJmhQ0YoSXw_0'
);

/*
async function signInWithTwitch() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'twitch',
    })
    console.warn(data);
}

signInWithTwitch();
*/

async function GetConfigFromSupabase() {
    const { data, error } = await supabase
        .schema('aonyxbuddy_public')
        .from('users')
        .select('*');
    data?.forEach(row => { console.log('row: ', row) });
}

GetConfigFromSupabase();

//declare const providedConfig: IAonyxBuddyInstance;
/*
function GetConfig(): IAonyxBuddyInstance {
    if (typeof providedConfig !== 'undefined') {
        return providedConfig;
    }
    return defaultConfig
}

export const config: IAonyxBuddyInstance = GetConfig();

*/