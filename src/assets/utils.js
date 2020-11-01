
module.exports = {


  avoidBreak: (str) => {
 
  },
  getItem:,
  getCommand: (str, commandCache) => {
    if (!str || !commandCache) return;
    return commandCache.get(str.toLowerCase()) || commandCache.find((command) => { return command.aliases && command.aliases.includes(str.toLowerCase()) });
  },
  getPage: (array, length, page) => {
    if (!array || array.constructor !== Array) return;
    if (!length || length.constructor !== Number) return;
    if (!page || page.constructor !== Number) return;
    page--;
    let l = length - 1;
    let start = 0 + (length * page);
    let end = l + (length * page);
    if (end >= array.length) {
      end = array.length - 1;
    }
    page++;
var pages_length = (array.length / length).toString().split(".");
if(pages_length[1]){
    pages_length = parseInt(pages_length[0]) + 1;
} else {
    pages_length = parseInt(pages_length[0])
}
if(pages_length <= 0) pages_length = 1;
    return { start: start, end: end, array:  array, length: length, page: page, pages: pages_length};
  },
  getUserFromMention: (mention, UserManager) => {
	async function run(){
    if (!mention ||!UserManager) return;
    mention =  `${mention}`


           if (mention.startsWith("<@") && mention.endsWith(">")) {
      mention = mention.slice(2, -1);
      if (mention.startsWith("!")) {
        mention = mention.slice(1);
      }
    }
  try {
  return UserManager.fetch().catch(e => e) ;
 } catch (e) {
     return console.error(e);
 }
 }
 return run().then(i => i);
  },
  errorEmbed: (error) => {
    
  },
  getEmojiFromMention: (mention, EmojiManager) => {
      if(!mention || !EmojiManager) return;
      mention = `${mention}`;
      
      mention = mention.match(/^<a?:(\w+):(\d+)>$/);
      if(!mention) return;
      return EmojiManager.resolve(mention[2]);
      },
}

module.exports.getRandomFunfact = module.exports.getFooter;