declare module 'dom-to-image-more' {
    interface DomToImageOptions {
        quality?: number;
        bgcolor?: string;
        width?: number;
        height?: number;
        style?: Record<string, string>;
        filter?: (node: Node) => boolean;
        imagePlaceholder?: string;
        cacheBust?: boolean;
    }

    function toPng(node: Node, options?: DomToImageOptions): Promise<string>;
    function toJpeg(node: Node, options?: DomToImageOptions): Promise<string>;
    function toBlob(node: Node, options?: DomToImageOptions): Promise<Blob>;
    function toSvg(node: Node, options?: DomToImageOptions): Promise<string>;
    function toPixelData(node: Node, options?: DomToImageOptions): Promise<Uint8ClampedArray>;

    export default {
        toPng,
        toJpeg,
        toBlob,
        toSvg,
        toPixelData
    };
}
