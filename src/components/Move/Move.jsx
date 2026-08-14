import MoveTable from "./MoveTable";
import "./Move.css"

function Move({ levelUpMoves, tmMoves, eggMoves }) {

    return (
        <div className="moves">

            <div className="move-category level-up">
                <h3 className="move-title">Level Up</h3>

                <MoveTable
                    moves={levelUpMoves}
                    extraColumn="Level"
                />
            </div>


            <div className="move-category machine">
                <h3 className="move-title">Machine</h3>

                <MoveTable
                    moves={tmMoves}
                    extraColumn="TM"
                />
            </div>


            {eggMoves.length > 0 && (
                <div className="move-category egg">
                    <h3 className="move-title">Egg</h3>

                    <MoveTable
                        moves={eggMoves}
                    />
                </div>
            )}

        </div>
    );
}

export default Move;