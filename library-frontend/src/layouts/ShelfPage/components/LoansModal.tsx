import React from 'react'
import ShelfCurrentLoans from '../../../models/ShelfCurrentLoans';

export const LoansModal:React.FC<{
    shelfCurrentLoans: ShelfCurrentLoans, mobile: boolean;
}> = (props) => {
    const { shelfCurrentLoans, mobile } = props;

  return (
    <div className='modal fade' id={mobile?`mobilemodal${shelfCurrentLoans.book.id}`: `modal${shelfCurrentLoans.book.id}`}
    data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true" key={shelfCurrentLoans.book.id}>
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="staticBackdropLabel">
                        Loan Options
                    </h5>
                    <button className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div className="modal-body">
                    <div className="container">
                        <div className="mt-3">
                            <div className="row">
                                <div className="col-2">
                                    {
                                        shelfCurrentLoans.book.img?
                                        <img src={shelfCurrentLoans.book.img} width="56" height="87" alt="Book"/>:
                                        <img src={require('../../../Images/BooksImages/book-luv2code-1000.png')} width="56" height="87" alt="Book"/>
                                    }
                                </div>
                                <div className="col-10">
                                    <h6>{shelfCurrentLoans.book.author}</h6>
                                    <h4>{shelfCurrentLoans.book.title}</h4>
                                </div>
                            </div>
                            <hr />
                            {shelfCurrentLoans.daysLeft > 0 && <p className="text-secondaary">Due in {shelfCurrentLoans.daysLeft} days.</p> }
                            {shelfCurrentLoans.daysLeft === 0 && <p className="text-success">Due Today.</p> }
                            {shelfCurrentLoans.daysLeft <= 0 && <p className="text-danger">Overdue by {Math.abs(shelfCurrentLoans.daysLeft)} days.</p> }
                            
                            <div className="list-group mt-3">
                                <button data-bs-dismiss="modal" className="list-group-item list-group-item-action" aria-current="true">
                                    Return Book
                                </button>
                                <button data-bs-dismiss="modal" 
                                className={shelfCurrentLoans.daysLeft < 0 ?
                                    'list-group-item list-group-item-action inactiveLink' :
                                    'list-group-item list-group-item-action'}>
                                    {shelfCurrentLoans.daysLeft < 0 ? 'Late dues cannot be renewed' : 'Renew loan for 7 days'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" type='button' data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>

    </div>
  )
}
