export function Toolbar() {
  return (
    <div className='toolbar' role='toolbar'>
      <div className='toolbar__left'>
        <nav>
          <ol>
            <li>
              <button type="button" aria-pressed="true">Mappings</button>
            </li>
            <li>
              <button type="button" aria-pressed="false">Iterations</button>
            </li>
          </ol>
        </nav>
      </div>
      <div className='toolbar__center'>
        <div>
          <button type='button'>
            <i className="fa-solid fa-arrow-pointer"></i>
            <span>Select</span>
          </button>
          <button type='button'>
            <i className="fa-regular fa-file"></i>
            <span>New</span>
          </button>
          <button>
            <i className="fa-solid fa-trash-can"></i>
            <span>Remove</span>
          </button>
        </div>
      </div>
      <div className="toolbar__right">
        <button>
          <i className="fa-solid fa-user"></i>
        </button>
      </div>
    </div >
  )
}