// research papers

const researchPaperData = [
  {
    title: "Neural Adaptive Video Streaming with Pensieve (2017)",
    url: "https://dl.acm.org/doi/10.1145/3098822.3098843",
    dateAdded: "2025-12-22",
    category: "science",
    medium: "research paper",
    tags: ['video-streaming', 'adapative-bitrate', 'reinforcement-learning'],
    tldr: "RL for dynamic ABR for better user experience when streaming videos.",
    notes: `
**Main Idea: Pensieve, a reinforcement learning system for learned adaptive bitrate (ABR) algorithms**
- Learns ABR decisions via the performance of past decisions.
- Improves average quality of experience (QoE) by 12-25%

**Background about ABR Algorithms:**
- Adaptive bitrate (ABR) algorithms are used by providers to optimize video quality (maximize QoE)
- Selecting the right bitrate is challenging because of variable network throughput, conflicting video QoE requirements, cascading effects of bitrate decisions, and the coarse-grained nature of ABR decisions.
- Existing ABR algorithms have **fixed control rules** and are tuned manually for **one QoE objective**. They don't adapt well to changes in QoE goals.

**Pensieve** is a system that learns ABR algorithms automatically via RL and optimizes the control policy for the characteristics of the network. The high-level architecture can be seen below:

:::figure
![Figure 2 in Paper; RL in Bitrate Adaptation](https://riyer8.github.io/assets/bookshelfImages/bitrate_image.png)
This is the image that can be found in the article, displaying the architecture of RL in Bitrate Adaptation. The ABR agent is trained on a neural network policy using RL to pass back QoE-based rewards, providing feedback on refined bitrate decisions.
:::

**Design of Pensieve:**
- Simulated video streaming environment (because real-world training would have been too slow). The simulator maintained the client playback buffer with the assigned download time based on the bitrate and input network traces for fast, repeatable training.
- Utilized a **A3C (Asynchronous Advantage Actor-Critic) RL algorithm** to train the neural network.
  - This is a powerful deep RL algorithm that uses multiple agents training in parallel and asynchronously updating a shared model.
  - **State:** past throughput, download time, buffer size, video chunk sizes, number of chunks remaining, previous bitrate decision
  - **Action:** select the bitrate for the next video chunk from a set of available bitrates
  - **Reward:** QoE metric that linearly balances video quality, rebuffering time, and smoothness of video quality
- Generalizes to unseen networks and works on synthetic training data. This transfers across videos with different bitrates and lengths.
- Evaluated against MPC, BOLA, and buffer-based approaches on real-world network traces.

**Outcome of Pensieve:**
- Pensieve learns **different policies for different QoE objectives** and will automatically balance bitrate utility, rebuffering penalty, and smoothness penalty based on the QoE function. This aids long-term planning.
      `
  },

  {
    title: "A Buffer-Based Approach to Rate Adaptation: Evidence from a Large Video Streaming Service (2014)",
    url: "https://yuba.stanford.edu/~nickm/papers/sigcomm2014-video.pdf",
    dateAdded: "2025-12-27",
    category: "science",
    medium: "research paper",
    tags: ['video-streaming', 'adapative-bitrate', 'reinforcement-learning'],
    tldr: "The buffer occupancy is more reliable signal than bandwidth estimation for ABR algorithms.",
    notes: `
**Main Idea:**
- Utilize capacity estimation when needed (it is not necessary at a steady state).
- Able to reduce rebuffer rate by 10-20% compared to Netflix's default ABR algorithm.

**Overview and Background:**
- ABR algorithms balance two goals: maximize video quality and minimize rebuffering events.
- One approach is to estimate the future capacity based on prior observations.
- Current ABR algorithms estimate capacity and make adjustments such that the rate is more conservative when the buffer is underrunning and more aggressive when the buffer is close to full.

**What differentiates this paper:**
- Here, they will only use the buffer to choose the video rate and then view the capacity estimate when needed.
- There are two phases of operation:
    - *Steady-state phase* when the buffer is being built up.
    - *Startup phase* when the buffer is still growing from empty.
- **Estimation is not needed in the steady-state phase.**
- In the baseline algorithm, there is still room for improvement:
    - The baseline algorithm doesn't address variable bit-rate (VBR) video encoding.
    - The baseline algorithm is optimized for steady-state phase.

**Design of Buffer-Based Algorithm:**
- Focus on pure buffer-based design: select video rate directly as a function of current buffer level.
- In the steady-state phase, choose video rate based only on playback buffer.
- In the startup phase, buffer has little information, so use capacity estimate to choose video rate.

**BBA-0 -> BBA-1 -> BBA-2:**
- BBA-0: Basic buffer-based algorithm that maps buffer size to video rate.
- BBA-1: Improves BBA-0 by addressing VBR video encoding. Uses "reservoir" to account for VBR fluctuations.
- BBA-2: Further improves BBA-1 by optimizing the startup phase using a more aggressive capacity estimation.
    `
  },

  {
    title: "Language Models as Knowledge Bases? (2019)",
    url: "https://arxiv.org/abs/1909.01066",
    dateAdded: "2026-03-16",
    category: "science",
    medium: "research paper",
    tags: ['large-language-models'],
    tldr: "",
    notes: `

Landmark Paper. First to prove that AI models like BERT secretly store a massive database of facts via its weights. This changed AI history (before the rise of daily LLM use) to a digital brain that knows everything.

Main Exploration: How much relational knowledge do they store? How does this diﬀer for diﬀerent types of knowledge such as facts about entities, common sense, and general question answering? How does their performance without fine-tuning compare to symbolic knowledge bases automatically extracted from text?

:::quote
We introduce the LAMA (LAnguage Model Analysis) probe, consisting of a set of knowledge sources, each comprised of a set of facts.
:::
Here, LAMA consists of a massive set of "fill-in-the-blank" (cloze) questions from high-quality sources. Here, LAMA would have to fill in the "masked" section, such as "Dante was born in [MASK]" without being allowed to search.

---

Causal/Autoregressive (GPT style): Models only look *backwards* to predict the next word at the end of the sentence.

Cloze/Bi-directional (BERT style): Models look at words before and after blank to get an understanding of context and relational facts.

---

Undirectional (Casual): Models used a "masked future". While they learn, they are "blindfolded" to everything that comes after the current word.

Bidirectional (Cloze): models have "full visibility". They can see the whole sentence at once and makes them better at understanding the relationship between words.

---

This paper showed that
- No "schema" required: As opposed to traditional databses, BERT is able to learn facts and not need a rigid structure on the inference side to answer back.
- "Lower bound" argument: Their results are likely a lower bound. BERT probably knows even more than the results of this paper determine.
- Hard vs. Easy Knowledge: BERT is great at common knowledge but not specialized knowledge.

*Note that because this paper was in 2019, some information may have been improved upon in more recent research.*

    `
  },

];

export default researchPaperData;
