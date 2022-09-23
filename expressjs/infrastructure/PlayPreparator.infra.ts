import { Play } from "../entities/plays";
import { PlayWithPosterInterface } from "../interfaces/plays";

export interface IPlayPreparator {
    preparePlayWithPoster(play: Play): PlayWithPosterInterface
}

export class PlayPreparator implements IPlayPreparator {
    public preparePlayWithPoster(play: Play) {
        return <PlayWithPosterInterface> {
            id: play.id,
            title: play.title,
            description: play.description.split('@'),
            crew: play.crew && play.crew?.split('@'),
            poster_filepath: play.playImages[0].image.filepath
        }
    }
}