// A new control that shows the area of 1M trees
// Uses Leaflet's Scale control for inspiration (https://github.com/Leaflet/Leaflet/blob/master/src/control/Control.Scale.js)

TreeScale = L.Control.extend({
    options: {
        position: 'bottomleft',
        numTrees: 1000000,
        treesPerHectare: (175000 / 75),
        heightRatio: 0.1,
        progress: 0,
        text: '1 million trees'
    },
    onAdd: function (map) {
        const className = 'tree-scale',
            container = L.DomUtil.create('div', className),
            options = this.options;
        this._treeScaleBox = L.DomUtil.create('div', className + '-box', container);
        this._treeScaleProgress = L.DomUtil.create('div', className + '-progress', this._treeScaleBox);
        this._treeScaleText = L.DomUtil.create('div', className + '-text', container);

        map.on('move', this._update, this);
        map.whenReady(this._update, this);

        return container;
    },
    _update: function () {
        const map = this._map;
        const mapBounds = map.getBounds();
        const pixelBounds = map.getPixelBounds();
        const mapWidthInM = map.distance(mapBounds.getSouthWest(), mapBounds.getSouthEast());
        const mapWidthInPixels = pixelBounds.max.x - pixelBounds.min.x;

        const areaInSqM = 10000 * (this.options.numTrees / this.options.treesPerHectare);
        const widthInM = Math.sqrt(areaInSqM / this.options.heightRatio);

        const widthInPixels = Math.round(widthInM * mapWidthInPixels / mapWidthInM);
        const heightInPixels = Math.round(this.options.heightRatio * widthInM * mapWidthInPixels / mapWidthInM);

        const progressWidthInPixels = Math.round((this.options.progress / 100.0) * widthInM * mapWidthInPixels / mapWidthInM);

        this._treeScaleBox.style.width = widthInPixels + 'px';
        this._treeScaleBox.style.height = heightInPixels + 'px';
        this._treeScaleProgress.style.width = progressWidthInPixels + 'px';
        this._treeScaleProgress.style.height = heightInPixels + 'px';
        this._treeScaleProgress.innerHTML = heightInPixels >= 14 ? this.options.progress.toFixed(1)  + "%" : '';
        this._treeScaleText.innerHTML = this.options.text;
    },
});

