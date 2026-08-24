import React from 'react';
import type { IGanpatiPandal } from '../../types/global';

interface Props {
  pandal: IGanpatiPandal;
}

const PandalPopupContent: React.FC<Props> = ({ pandal }) => (
  <>
    <div className="flex flex-row items-start gap-2">
      <img
        src={pandal.image_url}
        alt={pandal.name}
        className="h-12 w-12 object-cover object-top rounded shrink-0"
      />
      <div>
        <h1 className="text-xs font-bold mb-1">{pandal.name}</h1>
        <p className="text-xs"><strong>Location:</strong> {pandal.location}</p>
      </div>
    </div>
    <hr className="my-2" />
    <div className="flex justify-center">
      <a href={pandal.gmap_link} target="_blank" rel="noopener noreferrer">
        <button className="text-primary border border-primary text-xs font-bold py-1.5 px-3 rounded hover:opacity-90 transition-opacity shadow-sm">
          Google Map
        </button>
      </a>
    </div>
  </>
);

export default PandalPopupContent;
