const TurndownService = require("turndown");

module.exports = {
  name: "getArticle",
  desc: "scrape from a meme article",

  execute(message, args, cheerio, axios, Discord) {
    const td = new TurndownService();

    var searchTerm = args.join("+");
    const searchResults = [];
    const getSearch = async () => {
      try {
        var link = `https://knowyourmeme.com/search?context=entries&sort=relevance&q=${searchTerm}`;
        const { data } = await axios.get(link);
        const $ = cheerio.load(data);

        //Title
        $("tbody.entry-grid-body.infinite > tr > td > a").each((_idx, el) => {
          const articleData = $(el).attr("href");
          searchResults.push(articleData);
        });

        return searchResults;
      } catch (error) {
        console.log("error");
        throw error;
      }
    };

    getSearch().then((searchResults) => {
      //Get data from article
      console.log(searchResults);
      console.log(searchResults.length);
      var firstLink = searchResults[0];
      const getSiteData = async () => {
        try {
          var link = `https://knowyourmeme.com${firstLink}`;
          const { data } = await axios.get(link);
          const $ = cheerio.load(data);
          const siteData = [];
          siteData.push(link);

          //Title
          var TITLES = [];
          $("article.entry > header.rel.c > section.info > h1").each(
            (_idx, el) => {
              const articleData = $(el).text().replace(/\n/g, " ").trim();
              TITLES.push(articleData);
            }
          );
          TITLES = TITLES.join(" ");

          //Category
          var CATEGORY = [];
          $("div.entry-relations > a.category > span.label").each(
            (_idx, el) => {
              const articleData = $(el).text().replace(/\n/g, " ").trim();
              CATEGORY.push(articleData);
            }
          );
          CATEGORY = CATEGORY.join(" ");

          //Part of a series on...
          var SERIES = [];
          $("div.entry-relations > div > span").each((_idx, el) => {
            const articleData = $(el).text().replace(/\n/g, " ").trim();
            SERIES.push(articleData);
          });
          SERIES = SERIES.join(" ");

          //Info details
          var DETAILS = [];
          $("section.info > div.details > div.details-col > div.detail").each(
            (_idx, el) => {
              const articleData = $(el).text().replace(/\n/g, " ").trim();
              DETAILS.push(articleData);
            }
          );

          //About paragraph
          var ABOUT = [];
          $("#about")
            .siblings("p")
            .each((_idx, el) => {
              const articleData = $(el).html().replace(/\n/g, " ").trim();
              var markdownversion = articleData
                .split('<a href="')
                .join('<a href="https://knowyourmeme.com/');
              markdownversion = td.turndown(markdownversion);
              ABOUT.push(markdownversion);
            });
          ABOUT = ABOUT.join(" ");

          //Image
          var IMG = [];
          $("div.photo-wrapper > a.full-image").each((_idx, el) => {
            const articleData = $(el).attr("href");
            siteData.push(articleData);
          });
          IMG = IMG.join(" ");

          siteData.push(TITLES);
          siteData.push(CATEGORY);
          siteData.push(SERIES);
          siteData.push(DETAILS);
          siteData.push(ABOUT);
          siteData.push(IMG);
          return siteData;
        } catch (error) {
          console.log("error");
          message.channel.send("Meme not found");
        }
      };

      //Return embed
      getSiteData().then((siteData) => {
        var link = siteData[0];
        var img = siteData[1];
        var name = siteData[2];
        var category = siteData[3];
        var series = siteData[4];
        var about = siteData[6];

        const memeEmbed = new Discord.MessageEmbed()
          .setColor("#0099ff")
          .setTitle(name)
          .setURL(link)
          //.setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
          .setDescription(about)
          .setImage(img)
          .setTimestamp()
          .setFooter("Retrieved from Know Your Meme");

        if (series.length == 0) {
          memeEmbed.addField("Not a part of any series", "\u200B", false);
        } else {
          memeEmbed.addField(
            "Part of a series on",
            series.substring(20),
            false
          );
        }

        //Row 1
        var details = siteData[5];
        memeEmbed.addField("Category", category, true);
        try {
          var year = details[2].split(" ")[2];
          memeEmbed.addField("Year: ", year, true);
        } catch (error) {
          memeEmbed.addField("\u200B", "\u200B", true);
        }
        memeEmbed.addField("\u200B", "\u200B", true);

        //Row 2
        try {
          var origin = details[1].substring(8);
          memeEmbed.addField("Origin: ", origin, true);
        } catch (error) {
          memeEmbed.addField("\u200B", "\u200B", true);
        }
        try {
          var type = details[3].substring(7);
          memeEmbed.addField("Type: ", type, true);
        } catch (error) {
          memeEmbed.addField("\u200B", "\u200B", true);
        }
        memeEmbed.addField("\u200B", "\u200B", true);

        message.channel.send(memeEmbed);
      });
    }
  );
  },
};
