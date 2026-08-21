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
        <button className="bg-primary text-white text-xs font-bold py-1 px-2 rounded">
          Google Map
        </button>
      </a>
    </div>
  </>
);

export default PandalPopupContent;
