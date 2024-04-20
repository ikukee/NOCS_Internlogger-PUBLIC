export const AttendanceTiles = ({ attendances, month }) => {
    const getNumberDays = (x) => {
        let date = new Date(x);
        let thisDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return thisDate.getDate();
    }

    const checker = (x) => {
        let d = new Date(x).getDate();
        let m = new Date(x).getMonth();
        let y = new Date(x).getFullYear();
        if(!attendances){
            return;
        }
        for (let attendance of attendances) {
            
            let d_2 = new Date(attendance.date).getDate();
            let m_2 = new Date(attendance.date).getMonth();
            let y_2 = new Date(attendance.date).getFullYear();

            if (y === y_2 && m === m_2 && d === d_2) {
                return <div className="attendance-box ab-present"></div>;
            }
        }
        return <div className="attendance-box"></div>;
    }

    return (
        <div className="attendance-container">
            {(() => {
                let arr = [];
                for (let i = 1; i <= getNumberDays(`01 ${month} ${new Date().getFullYear()}`); ++i) {
                    arr.push(checker(`${i} ${month} ${new Date().getFullYear()}`))
                }
                return arr;
            })()}
        </div>
    );
}
