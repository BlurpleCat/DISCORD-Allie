const { SlashCommandBuilder, ChannelType } = require("discord.js");
const agents = require("../agents.js");

// Store conversation history per thread
const conversationHistory = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("chat")
    .setDescription("Chat with the AI")
    .addStringOption((option) =>
      option
        .setName("model")
        .setDescription("Which model to talk to")
        .setRequired(true)
        .addChoices(
          { name: "ChatGPT", value: "ChatGPT" },
          { name: "Claude", value: "Claude" },
          { name: "Mistral", value: "Mistral" },
          { name: "Commandr", value: "Commandr" },
          { name: "DeepSeek", value: "DeepSeek" },
          { name: "Grok", value: "Grok" },
          { name: "Gemini", value: "Gemini" },
          { name: "Llama", value: "Llama" },
          { name: "Jamba", value: "Jamba" },
          { name: "Nova", value: "Nova" },
          { name: "Titan", value: "Titan" },
        ),
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Your message")
        .setRequired(true),
    ),

  async execute(interaction) {
    const model = interaction.options.getString("model");
    const message = interaction.options.getString("message");
    const user = `<@${interaction.user.id}>`;
    const Allie = `<@${interaction.client.user.id}>`;
    const agent = agents[model];

    const history = conversationHistory.get(interaction.channel.id) || [];

    const humanMessage = {
      role: "user",
      content: interaction.user.username + ": " + message,
    };
    console.log(humanMessage);
    history.push(humanMessage);
    const response = await agent.getResponse({ messages: history });
    history.push(response.responseMessage);
    let threadID = interaction.channel.isThread()
      ? interaction.channel.id
      : null;

    await interaction.reply(
      `${user}: ${message} \n\n ${Allie} **(${model})**: ${response.responseMessage.content}`,
    );
    if (!interaction.channel.isThread()) {
      // Create a thread to continue the conversation
      const thread = await interaction.channel.threads.create({
        name: `${message}`,
        autoArchiveDuration: 60, // Auto-closes after 1 hour
        type: ChannelType.GuildPublicThread,
        reason: `AI conversation with ${model}`,
      });
      // Post the initial message inside the thread
      await thread.send(
        `**${user}**: ${message}\n\n **${Allie} (${model})**: ${response.responseMessage.content}`,
      );
      threadID = thread.id;
    }
    conversationHistory.set(threadID, history);
  },

  // Listen for messages in the thread
  // async onMessage(message) {
  //     if (!message.channel.isThread()) return; // Ignore non-thread messages
  //     if (message.author.bot) return; // Ignore bot messages

  //     // Get thread history or initialize if not exists
  //     const threadId = message.channel.id;
  //     const history = conversationHistory.get(threadId) || [];

  //     // Store message in format "[username]: [message]"
  //     history.push(`${message.author.username}: ${message.content}`);
  //     conversationHistory.set(threadId, history);
  // }
};
