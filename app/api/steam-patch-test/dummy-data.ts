import bbobHTML from "@bbob/html";
import presetHTML5 from "@bbob/preset-html5";

const row =
  "[p]Greetings, Rivals![/p][p][/p][p]We're thrilled to announce that the upcoming patch drops on June 12, 2025, at 09:00:00 (UTC)! As usual, this update will be applied without server downtime—so you can dive right back into your epic battles as soon as the update is live![/p][p] [/p][p]Here's a look at what's coming in this patch:[/p][p] [/p][h1][b]616 Day Vault[/b][/h1][p][/p][p]To celebrate 616 Day and the larger Marvel Universe, we're launching the inaugural 616 Vault event on June 13th![/p][p]For one week only, enjoy the return of exclusive limited-time bundles:[/p][p]· Venom - Snow Symbiote Bundle[/p][p]· Magik - Frozen Demon Bundle[/p][p]· Rocket Raccoon - Wild Winter Bundle[/p][p]· Groot - Holiday Happiness Bundle[/p][p]· Hawkeye - Galactic Fangs Bundle[/p][p]· Captain America - Galactic Talon Bundle[/p][p]Event Duration: 2025/6/13 02:00:00 (UTC) ~ 2025/6/20 02:00:00 (UTC)[/p][p] [/p][h1][b]New In Store[/b][/h1][p][/p][p]1.  Invisible Woman - Future Foundation Bundle[/p][p]2. The Thing - Future Foundation Bundle[/p][p]Available from 2025/6/13, 02:00:00 (UTC)[/p][p] [/p][h1][b]Fixes[/b][/h1][h2][b]All Platforms[/b][/h2][p][/p][p]1. Fixed an issue where Doctor Strange could not use emotes in Doom Match.  [/p][p]2. Fixed incorrect display of Trusty Sidekick and Gifted Healer stats in Career custom data.  [/p][p]3. Fixed possible errors in displaying Career Highest Rank Eternity scores for All Seasons.  [/p][p]4. Fixed inconsistent In-Game Friends status updates in the team lobby.  [/p][p]5. Fixed rare cases where the Hero Ban feature might not function properly.  [/p][p] [/p][h2][b]Heroes[/b][/h2][p][/p][p]1. Strange's Portal Puzzle: Resolved a mystical mishap where Doctor Strange's portals could sometimes, under certain latency conditions, open up straight into the spawn room. Stephen's portals now stay on the right path!  [/p][p]2. Winter Soldier's Cold Cut: Fixed a rare bug where Winter Soldier's Ultimate Ability could be interrupted if Moon Knight's Ankh sent him flying at the exact moment of activation. Now, even Khonshu's knight can't freeze Bucky's finishing move ever AGAIN!  [/p][p]3. Jeff & Storm's Wild Ride: Addressed a quirk where the Team-Up between Jeff the Land Shark and Storm could, in extreme cases, send Jeff zooming at super-speed. The only thing breaking the sound barrier now is Storm's thunder—Jeff's back to making a splash, not a dash!  [/p][p] [/p][p] [/p][p]The Marvel Rivals universe is ever-evolving, and we have plenty more surprises and updates on the horizon. Stay tuned to our official announcements for more![/p]";

const processed = bbobHTML(row, presetHTML5());

export const dummyData = {
  appnews: {
    appid: 2767030,
    newsitems: [
      {
        gid: "1801617199563047",
        title: "Marvel Rivals Version 20250612 Patch Notes",
        url: "https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1801617199563047",
        is_external_url: true,
        author: "Marvel Rivals",
        contents: processed,
        feedlabel: "Community Announcements",
        date: 1749575148,
        feedname: "steam_community_announcements",
        feed_type: 1,
        appid: 2767030,
      },
    ],
    count: 184,
  },
};
