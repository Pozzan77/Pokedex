function MoveTable({ moves, extraColumn }) {

    return (
        <div className={`move-table ${extraColumn ? "has-extra" : ""}`}>

            <div className="move-header">

                <span className="move-name">Move</span>
                <span>Type</span>
                <span>Power</span>
                <span>Category</span>
                <span>Accuracy</span>

                {extraColumn && (
                    <span>{extraColumn}</span>
                )}

            </div>

            {moves.map((move) => (

                <div className="move-row" key={move.name}>

                    <span className="move-name">{move.name}</span>

                    <span className={`type move-type ${move.type}`}>
                        {move.type.charAt(0).toUpperCase() + move.type.slice(1)}
                    </span>

                    <span>{move.power ?? "—"}</span>

                    <span>{move.category}</span>

                    <span>
                        {move.accuracy
                            ? `${move.accuracy}%`
                            : "—"}
                    </span>

                    {extraColumn === "Level" && (
                        <span>
                            Lv. {move.level}
                        </span>
                    )}

                    {extraColumn === "TM" && (
                        <span>
                            {move.machine ?? "—"}
                        </span>
                    )}

                </div>

            ))}

        </div>
    );
}

export default MoveTable;