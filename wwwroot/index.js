window.addEventListener('load', () => {
    /* SignalR */
    const connection = new signalR.HubConnectionBuilder()
                                    .withUrl('/drawHub')
                                    .build();
    
    connection.on('ReceiveDraw', (model) => {
        switch(model.type) {
            case 'line':
                ctx.strokeStyle = model.color;
                ctx.lineWidth = model.lineWidth;
                ctx.beginPath();
                ctx.moveTo(model.startPos[0], model.startPos[1]);
                ctx.lineTo(model.endPos[0], model.endPos[1]);
                ctx.closePath();
                ctx.stroke();

                break;
            case 'clearBoard':
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                break;
        }
        
    });

    connection.on('InitialDraw', (models) => {
        for(const model of models) {
            switch(model.type) {
                case 'line':
                    ctx.strokeStyle = model.color;
                    ctx.lineWidth = model.lineWidth;
                    ctx.beginPath();
                    ctx.moveTo(model.startPos[0], model.startPos[1]);
                    ctx.lineTo(model.endPos[0], model.endPos[1]);
                    ctx.closePath();
                    ctx.stroke();
    
                    break;
            }
        }
    });

    connection.start()
                .then(() => {
                    connection.invoke('GetModels')
                                .catch((err) => console.error(err));
                }).catch((err) => console.error(err));

    /* Canvas */
    const canvas = document.querySelector('#board');
    const colorSelectItem = document.querySelector('#colorSelect');
    const lineWidthSelectItem = document.querySelector('#lineWidthSelect');
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;

    let leftFlag = false;
    let touchFlag = false;

    const loadSettings = () => {
        if(colorSelectItem && lineWidthSelectItem) {
            ctx.strokeStyle = colorSelectItem.value;
            ctx.lineWidth = lineWidthSelectItem.value;
        }
    }

    canvas.addEventListener('mousedown', (event) => {
        switch(event.which) {
            case 1:
                console.log('Left mousedown');

                leftFlag = true;

                canvas.offsetX = canvas.offsetLeft;
                canvas.offsetY = canvas.offsetTop;

                let o = canvas;
                while(o.offsetParent) {
                    o = o.offsetParent;
                    canvas.offsetX += o.offsetLeft;
                    canvas.offsetY += o.offsetTop;
                }

                canvas.lastStartPos = [event.pageX - canvas.offsetX, event.pageY - canvas.offsetY];

                break;
        }
    });

    canvas.addEventListener('mousemove', (event) => {
        if(leftFlag) {
            console.log('Left mousemove');

            loadSettings();
            ctx.beginPath();
            ctx.moveTo(canvas.lastStartPos[0], canvas.lastStartPos[1]);
            canvas.lastEndPos = [event.pageX - canvas.offsetX, event.pageY - canvas.offsetY];
            ctx.lineTo(canvas.lastEndPos[0], canvas.lastEndPos[1]);
            ctx.closePath();
            ctx.stroke();

            // Transfer
            connection.invoke('SendDraw', {
                "type": "line",
                "startPos": canvas.lastStartPos,
                "endPos": canvas.lastEndPos,
                "color": ctx.strokeStyle,
                "lineWidth": ctx.lineWidth
            }).catch((err) => console.error(err));

            canvas.lastStartPos = [canvas.lastEndPos[0], canvas.lastEndPos[1]];
        }
    });

    canvas.addEventListener('mouseup', (event) => {
        switch(event.which) {
            case 1:
                console.log('Left mouseup');

                leftFlag = false;
                break;
        }
    });

    canvas.addEventListener('touchstart', (event) => {
        console.log('Touch touchstart');

        event.preventDefault();

        touchFlag = true;

        const touch = event.touches[0];
        canvas.offsetX = canvas.offsetLeft;
        canvas.offsetY = canvas.offsetTop;

        let o = canvas;
        while(o.offsetParent) {
            o = o.offsetParent;
            canvas.offsetX += o.offsetLeft;
            canvas.offsetY += o.offsetTop;
        }

        
        canvas.lastStartPos = [touch.pageX - canvas.offsetX, touch.pageY - canvas.offsetY];
        
    });

    canvas.addEventListener('touchmove', (event) => {
        if(touchFlag) {
            console.log('touchmove');

            event.preventDefault();

            const touch = event.touches[0];

            loadSettings();
            ctx.beginPath();
            ctx.moveTo(canvas.lastStartPos[0], canvas.lastStartPos[1]);
            canvas.lastEndPos = [touch.pageX - canvas.offsetX, touch.pageY - canvas.offsetY];
            ctx.lineTo(canvas.lastEndPos[0], canvas.lastEndPos[1]);
            ctx.closePath();
            ctx.stroke();

            // Transfer
            connection.invoke('SendDraw', {
                "type": "line",
                "startPos": canvas.lastStartPos,
                "endPos": canvas.lastEndPos,
                "color": ctx.strokeStyle,
                "lineWidth": ctx.lineWidth
            }).catch((err) => console.error(err));

            canvas.lastStartPos = [canvas.lastEndPos[0], canvas.lastEndPos[1]];
        }
    });

    canvas.addEventListener('touchend', (event) => {
        console.log('touchend');

        event.preventDefault();

        touchFlag = false;
    });

    document.querySelector('#clearBoardBtn').addEventListener('click', (event) => {
        event.preventDefault();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        connection.invoke('SendDraw', {
            "type": "clearBoard"
        }).catch((err) => console.error(err));
    });
});