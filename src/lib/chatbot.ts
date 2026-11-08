type BotReply = {
  text: string;
  suggestions: string[];
};

const knowledge: Array<{ match: RegExp; reply: BotReply }> = [
  {
    match: /ship|deliver|courier|time/i,
    reply: {
      text: "We ship pan-India in 5–9 working days. Custom paintings may take 10–14 days because Sharda Jha paints each piece by hand.",
      suggestions: ["Track my order", "Custom painting", "Talk to artist"],
    },
  },
  {
    match: /custom|personal|dedicat|portrait|size|frame/i,
    reply: {
      text: "You can customize size, frame, color palette, border motifs, dedication text, and even upload a reference image. Open any product → Customize Studio.",
      suggestions: ["Open shop", "Saree borders", "Talk to human"],
    },
  },
  {
    match: /saree|sari|blouse/i,
    reply: {
      text: "Our Madhubani sarees feature hand-painted borders — temple, peacock, fish & lotus, or minimal line work. Blouse piece painting can be requested in custom notes.",
      suggestions: ["Browse sarees", "Customize saree", "WhatsApp us"],
    },
  },
  {
    match: /pay|razorpay|upi|card|refund/i,
    reply: {
      text: "We accept UPI, cards, and netbanking via Razorpay. Refunds for damaged transit pieces are processed within 5–7 days after QC photos.",
      suggestions: ["Place an order", "Talk to support"],
    },
  },
  {
    match: /artist|sharda|founder|ayush|about/i,
    reply: {
      text: "SHARDA MADHUBANI PAINTINGS is founded by artist Sharda Jha. Co-founder Ayush Aryan leads the digital atelier. Every painting carries Mithila storytelling tradition.",
      suggestions: ["Our story", "Featured works", "Chat with studio"],
    },
  },
  {
    match: /review|rating|feedback/i,
    reply: {
      text: "Bought a piece? Sign in, open the product page, and leave a review — your words help other collectors discover Madhubani art.",
      suggestions: ["Shop bestsellers", "Talk to human"],
    },
  },
  {
    match: /human|agent|support|chat|whatsapp|help/i,
    reply: {
      text: "I can connect you with the studio. Use Live Chat after signing in, or WhatsApp the atelier for faster replies during painting hours.",
      suggestions: ["Open live chat", "WhatsApp studio", "Browse shop"],
    },
  },
];

export function getBotReply(message: string): BotReply {
  for (const entry of knowledge) {
    if (entry.match.test(message)) return entry.reply;
  }
  return {
    text: "Namaste! I can help with shipping, customization, sarees, payments, or our artist Sharda Jha. What would you like to explore?",
    suggestions: [
      "Customize a painting",
      "Madhubani sarees",
      "Shipping time",
      "Talk to human",
    ],
  };
}
