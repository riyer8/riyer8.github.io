// research papers

const researchPaperData = [
  {
    title: "Neural Adaptive Video Streaming with Pensieve (2017)",
    url: "https://dl.acm.org/doi/10.1145/3098822.3098843",
    dateAdded: "2025-12-22",
    category: "science",
    medium: "research paper",
    tags: ['video-streaming', 'adaptive-bitrate', 'reinforcement-learning'],
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
- Utilized an **A3C (Asynchronous Advantage Actor-Critic) RL algorithm** to train the neural network.
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
    tags: ['video-streaming', 'adaptive-bitrate', 'reinforcement-learning'],
    tldr: "The buffer occupancy is a more reliable signal than bandwidth estimation for ABR algorithms.",
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

Landmark Paper. First to prove that AI models like BERT secretly store a massive database of facts via their weights. This changed AI history (before the rise of daily LLM use) to a digital brain that knows everything.

Main Exploration: How much relational knowledge do they store? How does this differ for different types of knowledge such as facts about entities, common sense, and general question answering? How does their performance without fine-tuning compare to symbolic knowledge bases automatically extracted from text?

:::quote
We introduce the LAMA (LAnguage Model Analysis) probe, consisting of a set of knowledge sources, each comprised of a set of facts.
:::
Here, LAMA consists of a massive set of "fill-in-the-blank" (cloze) questions from high-quality sources. Here, LAMA would have to fill in the "masked" section, such as "Dante was born in [MASK]" without being allowed to search.

---

Causal/Autoregressive (GPT style): Models only look *backwards* to predict the next word at the end of the sentence.

Cloze/Bi-directional (BERT style): Models look at words before and after the blank to get an understanding of context and relational facts.

---

Unidirectional (Causal): Models used a "masked future". While they learn, they are "blindfolded" to everything that comes after the current word.

Bidirectional (Cloze): models have "full visibility". They can see the whole sentence at once, which makes them better at understanding the relationship between words.

---

This paper showed that
- No "schema" required: As opposed to traditional databases, BERT is able to learn facts and not need a rigid structure on the inference side to answer back.
- "Lower bound" argument: Their results are likely a lower bound. BERT probably knows even more than the results of this paper determine.
- Hard vs. Easy Knowledge: BERT is great at common knowledge but not specialized knowledge.

*Note that because this paper was in 2019, some information may have been improved upon in more recent research.*
    `
  },

  {
    title: "Self play and autocurricula In the age of agents",
    url: "https://www.amplifypartners.com/blog-posts/self-play-and-autocurricula-in-the-age-of-agents",
    author: "Rohan Virani",
    dateAdded: "2026-04-18",
    category: "science",
    medium: "essay",
    tldr: "",
    thoughts: "",
    tags: ['science', 'AI', 'machine-learning'],
    notes: `
### This article is about self-play with reinforcement learning (RL), which results in autocurricula - or automatic curriculum. 

This is more formally defined below.

:::quote
autocurricula (def): a machine learning paradigm where AI agents (usually in multi-agent environments) automatically generate increasingly complex tasks and challenges for themselves to solve, rather than relying on human-designed training scenarios.
:::

As of November 5, 2025, we hadn't employed self-play for LLMs. More specifically, LLMs aren't able to generate problems in which another LLM is learning to solve and challenging the knowledge of an LLM in that way.

[Noam Brown](https://noambrown.github.io/) at OpenAI notes that
:::quote
“self-play works for two player zero sum games…like Go, Poker and Starcraft but is so much harder to use in real world domains”. 
:::

RL applications to help scale AI labs:
- increasing compute spend
- number of environments that agents are training on
- corresponding tasks to solve

### One of the key differentiators is to determine *in what order these tasks should be learned.*

> When training examples are ordered from easy to hard, convergence is faster and quality of local minima is higher (Yoshua Bengio).

This mimics how humans learn as well, starting from the basics and then learning harder and harder problems sequentially.

:::quote
basins of attraction (def): set of initial conditions (starting points) in a dynamical system that evolve over time towards a specific long-term behavior (known as the attractor)
:::

The following points demonstrate the bottlenecks of current AI systems.

> The marginal information gain from showing tasks based on what *humans* find easy or difficult is less than the potential information gain from showing tasks based on what the *model* finds easy or difficult. Put another way, we need to zero in on what the actual model is ready to learn next based on **its own** definition of easy or difficult, a region called its **learnable frontier**.

> The bottleneck is no longer maintaining the learnable frontier given a fixed set of tasks, but instead **finding new tasks to feed to the learnable frontier.**

### In order to design task variations, using **language models** to parameterize the distribution of tasks and sample from them is a current methodology employed by AI labs. 

This is a separate step before the training process - this is a fixed process. Possibly employing a continuous learning method can make the agents more versatile.

**We want self-play for language models.** Current methods that are framing the frontier:
- Absolute Zero - one of the first successful attempts at self-play with language models.
- SPICE (Self Play In Corpus Environments) - expanded the tasks tackled to include general reasoning problems.

However, this doesn't achieve state-of-the-art performance at larger scales. 

### Unsupervised Environment Design (UED)

This method automatically samples and adapts the task distribution, and even environment distribution, to the learner during training *while* introducing the second antagonist model. The multi-agent reinforcement learning setup looks like:
- Protagonist agent: trying to minimize regret
- Antagonist agent: helps define what is solvable
- Task generator (teacher): generates environments to maximize the regret gap
    
:::quote
This neat trick ensures that generated environments are always solvable by at least one student, the antagonist. If the protagonist (the person we really care about) ever catches up to its counterpart, the teacher will make the game more challenging again, but not so difficult that its ally can’t solve it. 
:::

While more stable, this method still has a major issue of sparse rewards since the teacher's rewards depend on the agents' actions on the task provided. This further causes a **long horizon**.

### Evolutionary Algorithms (EAs)

With evolutionary algorithms, we can generate new, diverse tasks. This is a method inspired by biological evolution.

:::quote
evolutionary algorithms (def): optimization techniques where population of candidate solutions evolves over time to find optimal or near-optimal solutions to a problem.
:::

Here, LLMs can take an environment and mutate it (as seen in AlphaEvolve). EAs can be used *with* learned environment generators.
`
  },

  {
    title: "Deep Reinforcement Learning from Human Preferences (2017)",
    url: "https://arxiv.org/abs/1706.03741",
    dateAdded: "2026-07-25",
    category: "science",
    medium: "research paper",
    tags: ['large-language-models', 'deep-rl', 'human-preferences'],
    tldr: "Integrating humans by using their feedback as the reward signal for complex goals.",
    notes: `
This paper is proposing a new method for humans to provide feedback for complex tasks, reducing the amount of feedback by orders of magnitude (since full human feedback would require a ton of time).

:::quote
In summary, we desire a solution to sequential decision problems without a well-specified reward
function that:
  1. enables us to solve tasks for which we can only recognize the desired behavior, but not
  necessarily demonstrate it,
  2. allows agents to be taught by non-expert users,
  3. scales to large problems, and
  4. is economical with user feedback.
:::

Essentially, humans would compare short video clips of what the agent does, making evaluation easier. This also may be specific to the experiments that this paper runs since both can be visually interpreted by humans: Atari games and robotics tasks.

:::quote
The paper has a policy $\\pi$ and reward function $\\hat{r}$, each containing deep neural networks. Those are each updated by:
  1. Policy $\\pi$ interacts with the environment -> produces trajectories $\\{\\tau^1,..., \\tau^i\\}$. $\\pi$ is updated as traditional RL to maximize the predicted rewards seen as $r_t = \\hat{r}(o_t, a_t)$.
    - Atari games: advantage actor-critic (A2C)
    - Robotics tasks: Trust Region Policy Optimization (TRPO). Adjusted hyperparameter for entropy bonus in TRPO.
    - Rewards normalized to a mean of zero + constant SD
  2. Select segments $(\\sigma^1, \\sigma^2)$ from trajectories $\\{\\tau^1,..., \\tau^i\\}$ from step 1, send them to the human to compare.
    - Humans compare two visualizations of trajectory segments, each clip being 1-2 seconds long.
    - Human indicates which segment they prefer. This is recorded in the database as $(\\sigma^1, \\sigma^2, \\mu)$ where $\\mu$ is over the distribution of $\\{1,2\\}$.
    - Human can choose to mark the comparison as incomparable, which will not include it in the database.
  3. The parameters of the mapping $\\hat{r}$ are optimized via supervised learning to fit comparisons collected by the human so far.
    - Follows the Bradley-Terry model for estimating score functions from pairwise preferences.
:::

*More formal math presented in the paper.*

Results showed that human feedback performed the same or slightly worse with the same number of labels, possibly attributed to human error in labeling and consistency.
    `
  }
];

export default researchPaperData;
