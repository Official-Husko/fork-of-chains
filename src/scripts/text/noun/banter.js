import { TOPIC_NOUN } from "../raw/banter/topic"

// get a random noun
setup.Text.topicnoun = function () {
  return setup.rng.choice(TOPIC_NOUN)
}
